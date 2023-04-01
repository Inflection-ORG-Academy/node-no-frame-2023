exports.globalErrorHandler = async (req, res, data) => {
  if (!res.error) {
    return { next: true };
  }
  res.writeHead(res.error.code, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify({ error: res.error.message }))
}