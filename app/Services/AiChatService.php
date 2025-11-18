<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatService
{
    private const MAX_RETRIES = 2;
    private const RETRY_DELAY_MS = 1000; // 1 second
    private const MODEL = 'gemini-2.5-flash';
    private const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1';

    public function chat(string $message, array $history = []): string
    {
        // Check if API key is configured
        $apiKey = config('gemini.api_key');
        if (empty($apiKey)) {
            Log::error('AI Chat Error: Gemini API key not configured');
            return "AI assistance is currently unavailable. Please contact an administrator or create a support ticket.";
        }

        $prompt = $this->buildPrompt($message, $history);

        // Try with retry logic
        $lastException = null;
        for ($attempt = 1; $attempt <= self::MAX_RETRIES; $attempt++) {
            try {
                // Make direct HTTP request to Gemini API
                $response = Http::timeout(60)
                    ->post(self::API_BASE_URL . '/models/' . self::MODEL . ':generateContent?key=' . $apiKey, [
                        'contents' => [
                            [
                                'parts' => [
                                    ['text' => $prompt]
                                ]
                            ]
                        ],
                        'generationConfig' => [
                            'temperature' => 0.7,
                            'maxOutputTokens' => 1024,
                        ]
                    ]);

                if ($response->successful()) {
                    $data = $response->json();

                    // Extract text from response
                    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                        $text = $data['candidates'][0]['content']['parts'][0]['text'];

                        if (!empty($text)) {
                            Log::info("AI Chat: Successfully generated response on attempt {$attempt}");
                            return $text;
                        }
                    }

                    Log::warning("AI Chat attempt {$attempt}: Response successful but no text content found");
                } else {
                    $errorBody = $response->body();
                    Log::warning("AI Chat attempt {$attempt}/" . self::MAX_RETRIES . " failed with status {$response->status()}: {$errorBody}");
                }

            } catch (\Exception $e) {
                $lastException = $e;
                Log::warning("AI Chat attempt {$attempt}/" . self::MAX_RETRIES . " failed: " . $e->getMessage());
            }

            if ($attempt < self::MAX_RETRIES) {
                usleep(self::RETRY_DELAY_MS * 1000 * $attempt); // Exponential backoff
            }
        }

        // All retries failed
        Log::error('AI Chat Error after all retries: ' . ($lastException ? $lastException->getMessage() : 'Unknown error'));

        return "I'm having trouble connecting right now. Please try again in a moment or create a support ticket for assistance.";
    }

    private function buildPrompt(string $message, array $history): string
    {
        $systemPrompt = "You are a helpful IT support assistant for a helpdesk system. ";
        $systemPrompt .= "Provide clear, professional, and friendly responses to user questions. ";
        $systemPrompt .= "Focus on IT support, troubleshooting, and common technical issues. ";
        $systemPrompt .= "Keep responses concise (2-3 paragraphs max). ";
        $systemPrompt .= "If you don't know something, suggest creating a support ticket for human assistance.\n\n";

        $conversationContext = "";
        if (!empty($history)) {
            $conversationContext = "Previous conversation:\n";
            foreach ($history as $msg) {
                $role = $msg['role'] === 'user' ? 'User' : 'Assistant';
                $conversationContext .= "{$role}: {$msg['content']}\n";
            }
            $conversationContext .= "\n";
        }

        return $systemPrompt . $conversationContext . "User: {$message}\n\nAssistant:";
    }
}
