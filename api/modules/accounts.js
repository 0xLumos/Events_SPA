
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
import { encode, decode } from 'https://deno.land/std/encoding/base64url.ts'
import { HmacSha256 } from 'https://deno.land/std/hash/sha256.ts'
import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function createJWT(payload ) {
	const secret = 'ryweuftioovqiuhmhxwrunkfvsorniygwuiwrfamjhrycvuyikgjugbomnjupxucnskhjbuthxjabjsr'
	const header={alg:'HS256', typ: 'JWT'}
    const bHdr=encode(new TextEncoder().encode(JSON.stringify(header)));
    const bPyld=encode(new TextEncoder().encode(JSON.stringify(payload)));
    const oTkn=`${bHdr}.${bPyld}`;
    return oTkn+'.'+(new HmacSha256(secret)).update(oTkn).toString();
}


export async function verifyJWT(token) {
	console.log('Verifying JWT Token')
	const secret = 'ryweuftioovqiuhmhxwrunkfvsorniygwuiwrfamjhrycvuyikgjugbomnjupxucnskhjbuthxjabjsr'
	if (token === null){
		console.log('JWT Token is null')
		return null;
	}
    const parts=token.split('.');
    if(parts.length !== 3){
		console.log('JWT does not contain 3 parts')
        return null;
	}
    const calcSign=(new HmacSha256(secret)).update(`${parts[0]}.${parts[1]}`).toString();
    if(calcSign !== parts[2]){

        return null;
	}
    const pyld=JSON.parse(new TextDecoder().decode(decode(parts[1])));
    if(pyld.exp && Date.now()>pyld.exp){
		console.log('JWT token expired')
        return null;
	}
	console.log('JWT Verified')
    return true
}


export async function login(credentials) {
	const { user, pass } = credentials
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${user}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${user}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${user}";`
	let rolesql = `SELECT role FROM accounts WHERE user = "${user}";`
	records = await db.query(sql)
	let role = await db.query(rolesql)
	const userobj = {}
	userobj.user = user
	userobj.role = role[0]
	const valid = await compare(pass, records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${user}"`)
	return userobj
}


export async function register(credentials) {
	credentials.pass = await hash(credentials.pass, salt)
	const sql = `INSERT INTO accounts(user, pass, role) VALUES("${credentials.user}", "${credentials.pass}", "${credentials.role}")`
	console.log(sql)
	await db.query(sql)
	return true
}
