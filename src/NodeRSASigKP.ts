import { SignatureKeyPair } from '@hyper-hyper-space/core';
import { Strings } from '@hyper-hyper-space/core';



class NodeRSASigKP implements SignatureKeyPair {

    publicKeyPEM?: string;
    privateKeyPEM?: string;

    keyPair?: any;

    async generateKey(params?: {b?: number}): Promise<void> {

        const NodeRSA = require('node-rsa');

        this.keyPair = new NodeRSA();

        this.keyPair.setOptions({
            environment: 'browser'
        });

        this.keyPair.generateKeyPair(params?.b || 2048);

        this.publicKeyPEM  = this.keyPair.exportKey('pkcs8-public-pem');
        this.privateKeyPEM = this.keyPair.exportKey('pkcs8-private-pem');

    }

    async loadKeyPair(publicKey?: string, privateKey?: string): Promise<void> {

        const NodeRSA = require('node-rsa');
        
        if (privateKey !== undefined) {

            this.keyPair = new NodeRSA();

            this.keyPair.setOptions({
                environment: 'browser'
            });
    
            this.keyPair.importKey(privateKey, 'pkcs8-private-pem');

            this.privateKeyPEM = privateKey;

            if (publicKey === undefined) {
                this.publicKeyPEM = this.keyPair.exportKey('pkcs8-public-pem');
            } else {
                this.publicKeyPEM = publicKey;
            }

        } else if (publicKey !== undefined) {
            this.keyPair = new NodeRSA();

            this.keyPair.setOptions({
                environment: 'browser'
            });

            this.keyPair.importKey(publicKey, 'pkcs8-public-pem');
            
            this.publicKeyPEM  = publicKey;
            this.privateKeyPEM = undefined;
        } else {
            throw new Error('Could not import RSA private key using NodeRSA');
        }

    }

    getPublicKey(): string {
        if (this.publicKeyPEM === undefined) {
            throw new Error('Attempted to export public key, but NodeRSA keypair is uninitialized.');
        }

        return this.publicKeyPEM;
    }

    getPrivateKey(): string | undefined {
        if (this.publicKeyPEM === undefined) {
            throw new Error('Attempted to export private key, but NodeRSA keypair is uninitialized.');
        }

        return this.privateKeyPEM;
    }

    async sign(text: string): Promise<string> {
        if (this.keyPair === undefined) {
            throw new Error('Attempted to create signature, but NodeRSA keypair is uninitialized.');
        }

        return Strings.Uint8arrayToBase64(new Uint8Array(this.keyPair.sign(text)));
    }

    async verify(text: string, signature: string): Promise<boolean> {
        if (this.keyPair === undefined) {
            throw new Error('Attempted to verify signature, but NodeRSA keypair is uninitialized.');
        }

        return this.keyPair.verify(text, signature, undefined, 'base64');
    }

}

export { NodeRSASigKP };