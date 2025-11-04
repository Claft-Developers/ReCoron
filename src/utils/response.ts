import { NextResponse } from "next/server";

/**
 * 成功レスポンスを返す
 */
export function successResponse<T>(data: T, message: string = "success", status: number = 200) {
    return NextResponse.json({
        success: true,
        message,
        data,
    }, { status });
}

/**
 * 作成成功レスポンス (201 Created)
 */
export function createdResponse<T>(data: T, message: string = "created") {
    return NextResponse.json({
        success: true,
        message,
        data,
    }, { status: 201 });
}

/**
 * 更新成功レスポンス (200 OK)
 */
export function updatedResponse<T>(data: T, message: string = "updated") {
    return NextResponse.json({
        success: true,
        message,
        data,
    }, { status: 200 });
}

/**
 * 削除成功レスポンス (200 OK)
 */
export function deletedResponse(message: string = "deleted") {
    return NextResponse.json({
        success: true,
        message,
        data: null,
    }, { status: 200 });
}

/**
 * バリデーションエラーレスポンス (400 Bad Request)
 */
export function validationErrorResponse(message: string, errors?: Record<string, string[]>) {
    return NextResponse.json(
        {
            success: false,
            message,
            data: errors || null,
        },
        { status: 400 }
    );
}

/**
 * 認証エラーレスポンス (401 Unauthorized)
 */
export function unauthorizedResponse(message: string = "認証が必要です") {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
        { status: 401 }
    );
}

/**
 * 権限エラーレスポンス (403 Forbidden)
 */
export function forbiddenResponse(message: string = "このリソースへのアクセス権限がありません") {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
        { status: 403 }
    );
}

/**
 * Not Foundエラーレスポンス (404 Not Found)
 */
export function notFoundResponse(resource: string = "リソース") {
    return NextResponse.json(
        { 
            success: false,
            message: `${resource}が見つかりません`,
            data: null,
        },
        { status: 404 }
    );
}

/**
 * 競合エラーレスポンス (409 Conflict)
 */
export function conflictResponse(message: string) {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
        { status: 409 }
    );
}

/**
 * レート制限エラーレスポンス (429 Too Many Requests)
 */
export function rateLimitResponse(message: string = "リクエストが多すぎます。しばらく待ってから再試行してください") {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
        { status: 429 }
    );
}

/**
 * サーバーエラーレスポンス (500 Internal Server Error)
 */
export function serverErrorResponse(message: string = "サーバーエラーが発生しました") {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
        { status: 500 }
    );
}

/**
 * カスタムエラーレスポンス
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json(
        { 
            success: false,
            message,
            data: null,
        },
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
    },
    message: string = "success"
) {
    return NextResponse.json({
        success: true,
        message,
        data: {
            items: data,
            pagination,
        },
    });
}