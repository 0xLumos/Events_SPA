
/* logout.js */

import { customiseNavbar, loadPage, showMessage } from '../util.js'

export async function setup(node) {

		console.log('CONFIRMS: setup')
		customiseNavbar(['home', 'events', 'logout'])
		if(localStorage.getItem('authorization') === null) loadPage('login')
		const template = document.querySelector('template#confirms')
		const fragment = template.content.cloneNode(true)
		const section = fragment.querySelector('section')
		const p = document.createElement('p')
		const img = document.createElement('img')
		img.src = localStorage.getItem("itemimage")
		section.appendChild(img)
		section.appendChild(p)
		console.log(template)
		fragment.querySelector('p').innerText = `Confirm the pledge for the ${localStorage.getItem("pledgeitem")} ??`
		img.user = localStorage.getItem('username')
		//node.appendChild(template)
		node.appendChild(fragment)
		node.querySelectorAll('button').forEach( button => button.addEventListener('click', event => {
			console.log(event.target.innerText)
			if(event.target.innerText === 'OK') {
				const url = '/api/items'
				const options = {
					method: 'POST',
					headers: {
					'Content-Type': 'application/vnd.api+json',
					'Authorization': localStorage.getItem('authorization')
				},
				body: JSON.stringify("dadas")
			}
				// const response = await fetch(url, options)
				// console.log(response)
				console.log("dasdas")
				loadPage('details')
				
				showMessage('item pledged')
			} else {
				loadPage('details')
			}
		}))

}
