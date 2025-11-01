import { NextResponse } from "next/server";

/**
 * 成功レスポンスを返す
 */
export function successResponse<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status });
}

/**
 * 作成成功レスポンス (201 Created)
 */
export function createdResponse<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
}

/**
 * 更新成功レスポンス (200 OK)
 */
export function updatedResponse<T>(data: T) {
    return NextResponse.json(data, { status: 200 });
}

/**
 * 削除成功レスポンス (204 No Content)
 */
export function deletedResponse() {
    return new NextResponse(null, { status: 204 });
}

/**
 * バリデーションエラーレスポンス (400 Bad Request)
 */
export function validationErrorResponse(message: string, errors?: Record<string, string[]>) {
    return NextResponse.json(
        {
            error: message,
            errors,
        },
        { status: 400 }
    );
}

/**
 * 認証エラーレスポンス (401 Unauthorized)
 */
export function unauthorizedResponse(message: string = "認証が必要です") {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    );
}

/**
 * 権限エラーレスポンス (403 Forbidden)
 */
export function forbiddenResponse(message: string = "このリソースへのアクセス権限がありません") {
    return NextResponse.json(
        { error: message },
        { status: 403 }
    );
}

/**
 * Not Foundエラーレスポンス (404 Not Found)
 */
export function notFoundResponse(resource: string = "リソース") {
    return NextResponse.json(
        { error: `${resource}が見つかりません` },
        { status: 404 }
    );
}

/**
 * 競合エラーレスポンス (409 Conflict)
 */
export function conflictResponse(message: string) {
    return NextResponse.json(
        { error: message },
        { status: 409 }
    );
}

/**
 * レート制限エラーレスポンス (429 Too Many Requests)
 */
export function rateLimitResponse(message: string = "リクエストが多すぎます。しばらく待ってから再試行してください") {
    return NextResponse.json(
        { error: message },
        { status: 429 }
    );
}

/**
 * サーバーエラーレスポンス (500 Internal Server Error)
 */
export function serverErrorResponse(message: string = "サーバーエラーが発生しました") {
    return NextResponse.json(
        { error: message },
        { status: 500 }
    );
}

/**
 * カスタムエラーレスポンス
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json(
        { error: message },
        { status }
    );
}

/**
 * ページネーション付きレスポンス
 */
export function paginatedResponse<T>(
    data: T[],
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
) {
    return NextResponse.json({
        data,
        pagination,
    });
}