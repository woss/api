[Polkadot JS API](../README.md) › [Globals](../globals.md) › ["staking/erasPrefs"](_staking_erasprefs_.md)

# External module: "staking/erasPrefs"

## Index

### Functions

* [eraPrefs](_staking_erasprefs_.md#eraprefs)
* [erasPrefs](_staking_erasprefs_.md#erasprefs)

## Functions

###  eraPrefs

▸ **eraPrefs**(`api`: ApiInterfaceRx): *function*

*Defined in [packages/api-derive/src/staking/erasPrefs.ts:26](https://github.com/polkadot-js/api/blob/63573ca0de/packages/api-derive/src/staking/erasPrefs.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`api` | ApiInterfaceRx |

**Returns:** *function*

▸ (`era`: EraIndex): *Observable‹DeriveEraPrefs›*

**Parameters:**

Name | Type |
------ | ------ |
`era` | EraIndex |

___

###  erasPrefs

▸ **erasPrefs**(`api`: ApiInterfaceRx): *function*

*Defined in [packages/api-derive/src/staking/erasPrefs.ts:34](https://github.com/polkadot-js/api/blob/63573ca0de/packages/api-derive/src/staking/erasPrefs.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`api` | ApiInterfaceRx |

**Returns:** *function*

▸ (`withActive?`: boolean | BN | number): *Observable‹DeriveEraPrefs[]›*

**Parameters:**

Name | Type |
------ | ------ |
`withActive?` | boolean &#124; BN &#124; number |