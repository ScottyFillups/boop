import $ from '../util/dom'

$('#invite-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const roomId = $('#roomid-input').value
  window.location = `${window.location.href}invite/${roomId}`
})
