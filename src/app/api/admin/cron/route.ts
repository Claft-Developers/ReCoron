export async function GET() {
    // ここに Cron ジョブのロジックを実装
    return new Response("Cron job triggered", { status: 200 });
}