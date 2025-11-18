<?php

namespace App\Http\Controllers;

use App\Services\AiChatService;
use Illuminate\Http\Request;

class AiChatController extends Controller
{
    public function __construct(private AiChatService $aiChatService)
    {
    }
    
    public function chat(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:1000',
                'history' => 'nullable|array',
                'history.*.role' => 'required|in:user,assistant',
                'history.*.content' => 'required|string',
            ]);

            // Set max execution time to 60 seconds for this request
            set_time_limit(60);

            $response = $this->aiChatService->chat(
                $validated['message'],
                $validated['history'] ?? []
            );

            return response()->json([
                'success' => true,
                'response' => $response,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid request. Please check your message and try again.',
            ], 422);

        } catch (\Exception $e) {
            \Log::error('AI Chat Controller Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }
}
