const express = require('express')
const Joi = require('joi')
const { faker } = require('@faker-js/faker')

// Setup Express
const app = express()
app.use(express.json())

// Default courses
let courses = [1, 2, 3].map((id) => ({ id, name: faker.name.jobArea() }))

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/api/courses', (req, res) => {
  res.contentType('application/json').send(JSON.stringify(courses))
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body)

  if (error) {
    return res
      .status(400)
      .contentType('application/json')
      .send(
        JSON.stringify({
          status: 400,
          message: error.details[0].message.replaceAll('"', '')
        })
      )
  }

  const courseName = req.body.name
  const course = {
    id: courses.length + 1,
    name: courseName
  }

  courses.push(course)
  res.contentType('application/json').send(JSON.stringify(course))
})

app.get('/api/courses/:id', (req, res) => {
  const courseId = Number(req.params.id)
  const course = courses.find((course) => courseId === course.id)

  if (!course) {
    return res
      .status(400)
      .contentType('application/json')
      .send(
        JSON.stringify({
          status: 404,
          message: `Course with given ID - ${courseId} was not found.`
        })
      )
  }

  res.contentType('application/json').send(JSON.stringify(course))
})

app.put('/api/courses/:id', (req, res) => {
  const courseId = Number(req.params.id)
  const courseToUpdate = courses.find((course) => courseId === course.id)

  if (!courseToUpdate) {
    return res
      .status(404)
      .contentType('application/json')
      .send(
        JSON.stringify({
          status: 404,
          message: `Course with given ID - ${courseId} was not found.`
        })
      )
  }

  const { error } = validateCourse(req.body)

  if (error) {
    return res
      .status(400)
      .contentType('application/json')
      .send(
        JSON.stringify({
          status: 400,
          message: error.details[0].message.replaceAll('"', '')
        })
      )
  }

  courses = courses.map((course) => {
    if (courseToUpdate.id === course.id) {
      const courseName = req.body.name

      course.name = courseName
      courseToUpdate.name = courseName
    }

    return course
  })

  res.contentType('application/json').send(courseToUpdate)
})

app.delete('/api/courses/:id', (req, res) => {
  const courseId = Number(req.params.id)
  const courseToDelete = courses.find((course) => courseId === course.id)

  if (!courseToDelete) {
    return res
      .status(404)
      .contentType('application/json')
      .send(
        JSON.stringify({
          status: 404,
          message: `Course with given ID - ${courseId} was not found.`
        })
      )
  }

  courses = courses.filter((course) => course.id !== courseId)

  res.contentType('application/json').send(
    JSON.stringify({
      status: 200,
      message: `Course with given ID - ${courseId} was deleted successfully`,
      data: courseToDelete
    })
  )
})

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(course, schema)
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))