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
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string',
        ]);
        
        $response = $this->aiChatService->chat(
            $validated['message'],
            $validated['history'] ?? []
        );
        
        return response()->json([
            'success' => true,
            'response' => $response,
        ]);
    }
}
