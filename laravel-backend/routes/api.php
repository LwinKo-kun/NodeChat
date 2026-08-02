<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [ChatController::class, 'register']);
Route::post('/login', [ChatController::class, 'login']);
Route::get('/users/search', [ChatController::class, 'searchUsers']);
Route::post('/friends/add', [ChatController::class, 'addFriend']);
Route::get('/friends/{userId}', [ChatController::class, 'getFriends']);
Route::post('/messages/send', [ChatController::class, 'sendMessage']);
Route::get('/messages/fetch', [ChatController::class, 'getMessages']);

php?>