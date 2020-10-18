export default (ex, req, res, next) => {
  console.error('[Express]', ex)
  return res.status(500).send('Fatal error on server side.')
}