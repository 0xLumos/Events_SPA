
/* home.js */

import { customiseNavbar,loadPage,showMessage, getThumbnailDataURL } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'events', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		console.log(token)
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	// How to get the data from the url /api/files?
	// Save the posted data a JSON file and then display that JSON file ?
		const url = '/api/files'
		const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization'),
			'JWT': localStorage.getItem("cookie")

		},
	}
	
	const response = await fetch(url, options)
	const events = await response.json()
	const status = response.status
	console.log(localStorage.getItem('cookie'))
	const template = document.querySelector('template#event')
	for(const event of events.data.events) {
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = event.title
		fragment.querySelector('p').innerText = event.datetime.split('T')[0]
		const section = fragment.querySelector('section')
		const img = document.createElement('img')
		img.src = event.picture
		
		section.appendChild(img)
		const detailsbutton= document.createElement('button')
		detailsbutton.style.width = '100px'
		detailsbutton.style.height = '100px'
		section.appendChild(detailsbutton)
		// detailsbutton.addEventListener('click',loadPage('details'))
		console.log(event)
		detailsbutton.addEventListener("click", getDetails);
		
		
		function getDetails() {
			console.log(event.eventid)
			localStorage.setItem("idurl", event.eventid)
			loadPage("details")
	}
		node.appendChild(fragment)
	}
}

async function getDetails(title){
	
}