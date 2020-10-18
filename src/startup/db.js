import mongoose from 'mongoose'

export default async () => {
  const db = process.env.DB

  mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => { console.log(`Connected to DB: ${db}\n`) })
  .catch(() => { throw new Error(`Cannot load MongoDB`)})
}