<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    // --- AUTHENTICATION ---

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Registered successfully', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
        }

        return response()->json(['message' => 'Login successful', 'user' => $user]);
    }

    // --- FIND & ADD FRIENDS ---

    // Search users by name or email to add them
    public function searchUsers(Request $request)
    {
        $query = $request->query('q');
        $currentUserId = $request->query('user_id');

        $users = User::where('id', '!=', $currentUserId)
            ->where(function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('email', 'LIKE', "%{$query}%");
            })
            ->get(['id', 'name', 'email']);

        return response()->json($users);
    }

    // Send Friend Request / Add Friend
    public function addFriend(Request $request)
    {
        $request->validate(['user_id' => 'required|integer', 'friend_id' => 'required|integer']);

        // Prevent duplicate entries
        $exists = Friendship::where('user_id', $request->user_id)
            ->where('friend_id', $request->friend_id)
            ->exists();

        if (!$exists) {
            Friendship::create([
                'user_id' => $request->user_id,
                'friend_id' => $request->friend_id,
                'status' => 'accepted' // Direct add for simplicity
            ]);
        }

        return response()->json(['message' => 'Friend added successfully']);
    }

    // Get Friend List
    public function getFriends($userId)
    {
        $friendIds = Friendship::where('user_id', $userId)
            ->orWhere('friend_id', $userId)
            ->get(['user_id', 'friend_id']);

        $ids = [];
        foreach($friendIds as $f) {
            $ids[] = $f->user_id == $userId ? $f->friend_id : $f->user_id;
        }

        $friends = User::whereIn('id', $ids)->get(['id', 'name', 'email']);
        return response()->json($friends);
    }

    // --- CHATTING ---

    // Send a message
    public function sendMessage(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer',
            'message' => 'required|string',
        ]);

        $msg = Message::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json(['message' => 'Sent', 'data' => $msg], 201);
    }

    // Get conversation history between two users
    public function getMessages(Request $request)
    {
        $userId = $request->query('user_id');
        $friendId = $request->query('friend_id');

        $messages = Message::where(function($q) use ($userId, $friendId) {
                $q->where('sender_id', $userId)->where('receiver_id', $friendId);
            })
            ->orWhere(function($q) use ($userId, $friendId) {
                $q->where('sender_id', $friendId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}