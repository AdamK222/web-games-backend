export default () => {
  process.on('unhandledRejection', (ex) => {
    console.error('[Promise]',ex)
    process.exit(1)
  }).on('uncaughtException', (ex) => {
    console.error('[Uncaught]',ex)
    process.exit(1)
  })
}
