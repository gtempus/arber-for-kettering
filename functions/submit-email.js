export async function onRequestPost(context) {
  try {
    // Parse form data
    const formData = await context.request.formData();
    const submission = {
      name: formData.get('name'),
      email: formData.get('email'),
      zip: formData.get('zip'),
      timestamp: new Date().toISOString()
    };

    console.log(`[LOGGING FROM /submit-email]: Submission Info: ${JSON.stringify(submission, null, 2)}`);

    // Validate required fields
    if (!submission.name || !submission.email) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Name and email are required'
      }), { status: 400 });
    }

    // Get KV namespace (make sure to bind it in your Pages settings)
    const kv = context.env.FORM_SUBMISSIONS;

    // Generate a unique ID for this submission
    const id = Date.now().toString();

    // Store in KV
    await kv.put(`submission_${id}`, JSON.stringify(submission));

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for signing up!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred while processing your submission'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}