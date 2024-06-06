import jwt from "jsonwebtoken";

interface ICreateTokenPairParams<T> {
  payload: T;
  publicKey: string;
  privateKey: string;
}

export async function createTokenPair<T extends string | object | Buffer>({
  payload,
  publicKey,
  privateKey,
}: ICreateTokenPairParams<T>) {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.info(error);
  }
}
