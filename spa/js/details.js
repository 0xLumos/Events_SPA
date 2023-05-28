
/* details.js */

import { customiseNavbar,loadPage, showMessage } from '../util.js'

export async function setup(node) {
	console.log('DETAILS: setup')
	try {
		console.log(node)
		const jwt = localStorage.getItem('cookie')

	

		

		document.querySelector('header p').innerText = 'Details'
		customiseNavbar(['home', 'events', 'logout']) // navbar if logged in
		// add content to the page
		await addContent(node)
		
	}
	catch(err) {
		console.error(err)
	}
}

// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	// How to get the data from the url /api/files?
		const url = `/api/files/${localStorage.getItem('idurl')}`
		const options = {
		method: 'GET',
		headers: {
			//'mode': 'CORS',
			'Content-Type': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization'),
			'JWT': localStorage.getItem('cookie')

		},
	}
	
	const response = await fetch(url, options)
	const events = await response.json()
	console.log(events)
	if (response.status != 200){
			showMessage('You need to login to continue')
			loadPage('login')
		}
	const template = document.querySelector('template#details')
	for(const event of events.data.event) {
		
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = event.title
		fragment.querySelector('p').innerText = event.datetime.split('T')[0]
		if (event.datetime.split('T')[1].split(':')[0] >= 12){
			fragment.querySelector(' p:nth-of-type(2)').innerText = `${event.datetime.split('T')[1].split(':')[0]}:${event.datetime.split('T')[1].split(':')[1]} PM`
		}
		else{
			fragment.querySelector(' p:nth-of-type(2)').innerText = `${event.datetime.split('T')[1].split(':')[0]}:${event.datetime.split('T')[1].split(':')[1]} AM`
		}
		fragment.querySelector(' p:nth-of-type(3)').innerText = event.details
		const section = fragment.querySelector('section')
		const img = document.createElement('img')
		img.src = event.picture
		section.appendChild(img)
		node.appendChild(fragment)
	}
	for(const item of events.data.items) {
		if (localStorage.getItem('username') == item.user){
			break
		}
		
		const fragment = template.content.cloneNode(true)
		const section = fragment.querySelector('section')
		document.createElement('hr')
		fragment.querySelector('h2').innerText = 'Below Are the Items to be pledged for this event'
		const p = document.createElement('p')
		const img = document.createElement('img')
		img.src = item.firstitem
		section.appendChild(img)
		const img2 = document.createElement('img')
		img2.src = item.seconditem
		section.appendChild(img2)
		const img3 = document.createElement('img')
		img3.src = item.thirditem
		section.appendChild(img3)
		const img4 = document.createElement('img')
		img4.src = item.fourthitem
		section.appendChild(img4)
		const img5 = document.createElement('img')
		img5.src = item.fifthitem
		section.appendChild(img5)


		

		function firstitemconfirm() {

			console.log("First item selected")
			console.log(item)
			localStorage.setItem("pledgeitem", "First item")
			localStorage.setItem("itemimage", item.firstitem)
			console.log(localStorage.getItem("pledgeitem"))
			loadPage("confirms")
	}
	
		function seconditemconfirm() {
			console.log("Second item selected")

			console.log("Confirming")
			console.log(item)
			localStorage.setItem("pledgeitem", "Second item")
			localStorage.setItem("itemimage", item.seconditem)
			loadPage("confirms")
	}
	
		function thirditemconfirm() {
			console.log("Third item selected")

			console.log("Confirming")
			console.log(item)
			localStorage.setItem("pledgeitem", "Third item")
			localStorage.setItem("itemimage", item.thirditem)
			loadPage("confirms")
	}
	
		function fourthitemconfirm() {
			console.log("Fourth item selected")

			
			console.log(item)
			localStorage.setItem("pledgeitem", "Fourth item")
			localStorage.setItem("itemimage", item.fourthitem)
			loadPage("confirms")
	}
	
		function fifthitemconfirm() {
			console.log("Fifth item selected")
			
			console.log("Confirming")
			console.log(item)
			localStorage.setItem("pledgeitem", "Fifth item")
			localStorage.setItem("itemimage", item.fifthitem)
			loadPage("confirms")
	}

		// detailsbutton.addEventListener('click',loadPage('details'))
		node.appendChild(fragment)
		const firstconfirmbutton= document.createElement('button')
		const secondconfirmbutton= document.createElement('button')
		const thirdconfirmbutton= document.createElement('button')
		const fourthconfirmbutton= document.createElement('button')
		const fifthconfirmbutton= document.createElement('button')
		section.appendChild(firstconfirmbutton)
		section.appendChild(secondconfirmbutton)
		section.appendChild(thirdconfirmbutton)
		section.appendChild(fourthconfirmbutton)
		section.appendChild(fifthconfirmbutton)
		firstconfirmbutton.addEventListener("click", firstitemconfirm);
		secondconfirmbutton.addEventListener("click", seconditemconfirm);
		thirdconfirmbutton.addEventListener("click", thirditemconfirm);
		fourthconfirmbutton.addEventListener("click", fourthitemconfirm);
		fifthconfirmbutton.addEventListener("click", fifthitemconfirm);
		

	}
}

