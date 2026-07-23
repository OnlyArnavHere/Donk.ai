export const send = (res, { status = 200, message = 'Success', data = null, errors = [] } = {}) =>
  res.status(status).json({ success: status < 400, message, data, errors, timestamp: new Date().toISOString() });
