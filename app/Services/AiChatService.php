<?php

namespace App\Services;

use Gemini\Laravel\Facades\Gemini;

class AiChatService
{
    public function chat(string $message, array $history = []): string
    {
        $prompt = $this->buildPrompt($message, $history);
        
        try {
            $result = Gemini::geminiFlash()->generateContent($prompt);
            return $result->text();
        } catch (\Exception $e) {
            \Log::error('AI Chat Error: ' . $e->getMessage());
            return "I'm having trouble connecting right now. Please try again in a moment or create a support ticket for assistance.";
        }
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
