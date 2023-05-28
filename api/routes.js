
/* routes.js */

import { Router, helpers } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile } from './modules/util.js'
import { login, register, createJWT, verifyJWT } from './modules/accounts.js'
import { addevent,getAllEvents, getEvent, additems, getAllItems, getpledgeditems, addpledgeditems } from './modules/events.js'

const router = new Router()



// the routes defined here
router.get('/api/', async context => {
	console.log('GET /api/')
	const token = context.request.headers.get('Authorization')
	const jwt = context.request.headers.get('JWT')

	try {
		// Login in GET ? REST CRUD
	    console.log(`GET /api/ : Cookie is ${jwt}`)
	    const validJWT = await verifyJWT(jwt)
	    if (validJWT != true){
		    console.log('Invalid JWT Token')
		    context.response.status = 401
		    context.response.body = JSON.stringify("Invalid or Missing JWT token")
		}
		else{
			console.log(`auth: ${token}`)
			console.log(context.host)
			context.response.body = JSON.stringify(
			{
				
				
				
			name: 'Eventsf API',
			desc: 'API to demonstrate hateos principles',
			links: [
			{
				name: 'new event',
				desc: 'add a new events',
				href: `https://${context.host}/api/files`,
				method: 'POST'
			},
			{
				name: 'events',
				desc: 'a list of events',
				href: `https://${context.host}/api/files`,
				method: 'GET'
			},
			{
				name: 'verify user',
				desc: 'login a user from the credentials',
				href: `https://${context.host}/api/accounts`,
				method: 'GET'
			},
			{
				name: 'new user',
				desc: 'add a new user',
				href: `https://${context.host}/api/accounts`,
				method: 'POST'
			}

		]
	
				
			}, null, 2)
		}

	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message,
						
					}
				]
			}
		, null, 2)
	}
})

//router.get('/api/', async cont)
router.get('/api/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	try {
		const credentials = extractCredentials(token)
		
		console.log(credentials)
		console.log(sessionStorage.getItem('token'))
		const username = await login(credentials)
		// Set JWT for 20 minutes
		const data={exp: Date.now() + 4000000, username: username.user, role: username.role.role}
		console.log(data)
		console.log(`username: ${username.user}`)
		console.log(`role: ${username.role.role}`)
		const jwt = await createJWT(data)
		console.log(jwt)
		const jwtheader = context.request.headers.set('JWT', jwt)
		context.response.body = JSON.stringify(
			{
				
								
		link: 
			{
				name: "accounts",
				desc: "get user's records",
				href: `https://${context.host}/api/accounts`,
			}
		,
				data: { username, jwt },
				
				
			}, null, 2)
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message,
						
					}
				]
			}
		, null, 2)
	}
})

router.post('/api/accounts', async context => {
	console.log('POST /api/accounts')
	const body  = await context.request.body()
	// Check Auth function here for authorization ??
	const data = await body.value
	console.log(data)
	if (data.user == "admin"){
		data.role = "admin"
	}
	else{
		data.role = "user"
	}
	
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})



router.get('/api/files', async context => {
	console.log('GET /api/files')
	
	try {
			const events = await getAllEvents()
			for (const event of events){
		
				event.url = `https://${context.host}/api/files/${event.eventid}`
				console.log(event.url)
	}
				context.response.body = JSON.stringify(
				{
				name: 'events',
				desc: 'a list of events',
				href: events.url ,
				schema: {
					id: 'int',
					title: 'string',
					user: 'string',
					details: 'string',
					eventid: 'string',
					datetime: 'date-time',
					eventid:'string',
					picture: 'string',
					stamp:'date-time',
					url: 'string'
				}
		,
					
					data: { events }
				
				}, null, 2
			)
	}
	 catch (err) {
		console.log("Error ", err.message);
	}
		
		

})


router.get('/api/files/:id', async context => {
	
	try {
		const jwt = context.request.headers.get('JWT')
		console.log(`Cookie is ${jwt}`)
		const validJWT = await verifyJWT(jwt)
		if (validJWT != true){
		    console.log('Missing JWT Token')
		    context.response.status = 401
		    context.response.body = JSON.stringify("Invalid JWT token")
		}
		else{
			const params = helpers.getQuery(context, { mergeParams: true });
			console.log(params.id);
			context.response.status = 200;
			console.log(typeof(params.id))
			const event = await getEvent(params.id)
			const items = await getAllItems(params.id)
			const pledgeditems = await getpledgeditems(params.id)
			const json = JSON.stringify(event)
			console.log(JSON.parse(json).title)
			const eventt = event[0]
			context.response.body = JSON.stringify(
			
							
								
			{
		title: `${eventt.title}`,
		desc: `${eventt.details}`,
		schema: {
			user: 'string',
			titile: 'string',
			urlcode: 'string',
			description: 'string',
			picture: 'string',
			time: 'date-time'
		},
				data: { event, items }
				
			}, null, 2
		)
		}
		
} catch (err) {
	console.log("Error: ", err.message);
	}
});

router.post('/api/files', async context => {
	console.log('POST /api/files')
	try {
		const token = context.request.headers.get('Authorization')
		const jwt = context.request.headers.get('JWT')
		
		console.log(`auth: ${token}`)
		const body  = await context.request.body()
		const data = await body.value
		// Store the file name in a variable
		const filereferencer = await saveFile(data.base64, data.user)
		
		// Adds the hash to the data object
		data.hash = filereferencer
		// data.firstitem = firstitemRefernecer
		// data.seconditem = seconditemRefernecer
		// data.thirditem = thirditemRefernecer
		// data.fourthitem = fourthitemRefernecer
		// data.fifthitem = fourthitemRefernecer

		console.log(data)
		await addevent(data)
		await additems(data)
		await addpledgeditems( data.user,data.src)
		
		const validJWT = await verifyJWT(jwt)
		if (validJWT != true){
		    console.log('Missing JWT Token')
		    context.response.status = 401
		    context.response.body = JSON.stringify("Invalid JWT token")
		}
		else{
			context.response.status = 201
			context.response.body = JSON.stringify(
			{
				
				data: {
					message: 'file uploaded'
				}
			}
		)
		}
		
	} catch(err) {
		context.response.status = 400
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: 'a problem occurred',
						detail: err.message
					}
				]
			}
		)
	}
})

router.post('/api/items', async context => {
	console.log('POST /api/items')
	try {
		const token = context.request.headers.get('Authorization')
		const jwt = context.request.headers.get('JWT')
		console.log(`auth: ${token}`)
		
		const body  = await context.request.body()
		const data = await body.value
		// Store the file name in a variable
		await addpledgeditems("dasd","dadsa")
		
		const validJWT = verifyJWT(jwt)
		if (validJWT === null){
			context.response.status = 401
			context.response.body = "Invalid JWT token"
		}
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				
				data: {
					message: 'item uploaded'
				}
			}
		)
	} catch(err) {
		context.response.status = 400
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: 'a problem occurred',
						detail: err.message
					}
				]
			}
		)
	}
})
router.get("/(.*)", async context => {      
// 	const data = await Deno.readTextFile('static/404.html')
// 	context.response.body = data
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

export default router

