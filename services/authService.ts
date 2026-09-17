import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";


export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(password:string, hash:string):Promise<boolean>{
    const passwordMatch = await compare(password, hash);
    return passwordMatch;
}

function generateAccessToken(payload:any){

}
