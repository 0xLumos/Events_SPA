
/* events.js */

import { customiseNavbar, file2DataURI, loadPage, secureGet, showMessage } from '../util.js'

export async function setup(node) {
	console.log('EVENTS: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Add an event'
		customiseNavbar(['home', 'logout', 'events'])
		if(localStorage.getItem('authorization') === null) loadPage('login')
		// there is a token in localstorage
		node.querySelector('form').addEventListener('submit', await uploadData)
	} catch(err) {
		console.error(err)
	}
}

async function uploadData(event) {
	console.log('func UPLOAD DATA')
	event.preventDefault()
	const element = document.querySelector('input[name="file"]')
	console.log(element)
	const file = document.querySelector('input[name="file"]').files[0]
	console.log(file)
	const firstitem = document.querySelector('input[name="item1"]').files[0] || document.querySelector('input[name="file"]').files[0]
	const seconditem = document.querySelector('input[name="item2"]').files[0]|| document.querySelector('input[name="file"]').files[0]
	const thirditem = document.querySelector('input[name="item3"]').files[0]|| document.querySelector('input[name="file"]').files[0]
	const fourthitem = document.querySelector('input[name="item4"]').files[0]|| document.querySelector('input[name="file"]').files[0]
	const fifthitem = document.querySelector('input[name="item5"]').files[0]|| document.querySelector('input[name="file"]').files[0]
	const title = document.querySelector('input[name=title]').value
	const details = document.querySelector('textarea[name=description]').value
	const time = document.querySelector('input[type="datetime-local"]').value
	console.log(title)
	console.log(time)
	file.title = title
	file.time = time
	file.details = details
	file.base64 = await file2DataURI(file)
	file.firstitem = await file2DataURI(firstitem)
	file.seconditem = await file2DataURI(seconditem)
	file.thirditem = await file2DataURI(thirditem)
	file.fourthitem = await file2DataURI(fourthitem)
	file.fifthitem = await file2DataURI(fifthitem)
	var final = '';
	const length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		final += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
	file.unique = final
	console.log(file.unique)
	// window.localStorage.list = json
	file.user = localStorage.getItem('username')
	console.log(file)
	const url = '/api/files'
	const options = {
		method: 'POST',
		headers: {
			'mode': 'CORS',
			'Content-Type': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization'),
			'JWT' : localStorage.getItem("cookie")
		},
		body: JSON.stringify(file)
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)
	showMessage('event successfully uploaded')
	loadPage('home')
}
