import * as React from 'react'

function Demo() {
  const [data, setData] = React.useState('')

  function onSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const submittedData = {}

    formData.forEach((value, key) => {
      submittedData[key] = value
    })

    setData(submittedData)
  }

  function onReset() {
    setData('')
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{
          maxWidth: 300,
          background: '#fafafa',
          border: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        <input name="user" type="text" placeholder="username" />
        <input name="password" type="password" placeholder="password" />
        <button type="submit">Login</button>
        <button type="reset" onClick={onReset}>
          Reset
        </button>
      </form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default Demo
