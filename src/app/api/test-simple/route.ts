export async function GET() {
    return new Response(JSON.stringify({ message: 'Simple test working!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  export async function POST() {
    return new Response(JSON.stringify({ message: 'POST test working!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }