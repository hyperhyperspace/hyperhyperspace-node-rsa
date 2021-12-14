import { NodeRSASigKP } from './NodeRSASigKP';
import { NodeRSAEncKP } from './NodeRSAEncKP';

import { RSA, DelegatingRSAImpl, RSADefaults } from '@hyper-hyper-space/core';


class NodeRSA extends DelegatingRSAImpl implements RSA {

    constructor() {
        super(new NodeRSAEncKP(), new NodeRSASigKP());
    }

    static enable() {
        RSADefaults.impl = NodeRSA;
    }

}

export { NodeRSA };