/* events.js */

import { db } from './db.js'


export async function getEvent(id) {

	let sql = `SELECT count(id) AS count FROM events WHERE eventid="${id}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`event of id "${id}" not found`)
	sql = `SELECT * FROM events WHERE eventid = "${id}";`
	records = await db.query(sql)
	return records
}

export async function getAllEvents() {

	let sql = `SELECT * FROM events;`
	let records = await db.query(sql)
	return records
}
export async function getpledgeditems(id){
	let sql = `SELECT * FROM pledgeditems WHERE item = "${id}";`
	let records = await db.query(sql)
	return records
}
export async function addpledgeditems(user,item){
	const sql = `INSERT INTO pledgeditems(user,item) VALUES("${user}", "${item}")`
	console.log(sql)
	await db.query(sql)
	return true
}
export async function getAllItems(id) {

	let sql = `SELECT count(id) AS count FROM events WHERE eventid="${id}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`event of id "${id}" not found`)
	sql = `SELECT * FROM items WHERE eventid = "${id}";`
	records = await db.query(sql)
	return records
}

export async function additems(data){
	const sql = `INSERT INTO items(user,firstitem,seconditem,thirditem,fourthitem,fifthitem,eventid) VALUES("${data.user}", "${data.firstitem}","${data.seconditem}","${data.thirditem}","${data.fourthitem}","${data.fifthitem}","${data.unique}")`
	console.log(sql)
	await db.query(sql)
	return true
}

export async function addevent(data) {
	//const randomId = randomId()
	const sql = `INSERT INTO events(title,user,details,picture,datetime,eventid) VALUES("${data.title}","${data.user}", "${data.details}","${data.base64}","${data.time}","${data.unique}")`
	console.log(sql)
	await db.query(sql)
	return true
}