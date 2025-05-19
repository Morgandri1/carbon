import {
  KeyPair, 
  crypto_sign,
  crypto_sign_keypair,
  crypto_sign_verify_detached,
} from 'react-native-libsodium';
import RSA, {
  KeyPair as RsaKeyPair,
  
} from "react-native-fast-rsa";

RSA.useJSI = false;

class CarbonCrypto {
  signing_keypair: KeyPair;
  encryption_keypair: RsaKeyPair;
  
  constructor(signing_keypair?: KeyPair, encryption_keypair?: RsaKeyPair) {
    this.signing_keypair = signing_keypair ?? crypto_sign_keypair("uint8array");
    RSA.generate(2048).then((kp) => {
      this.encryption_keypair = kp
    })
  }

  getPublicKey() {
    return this.signing_keypair.publicKey;
  }

  sign(message: Uint8Array) {
    return crypto_sign(message, this.signing_keypair.privateKey);
  }
  
  verify(signature: Uint8Array, message: Uint8Array) {
    return crypto_sign_verify_detached(signature, message, this.signing_keypair.publicKey);
  }
}