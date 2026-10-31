import { sdk } from '../sdk'
import { configureProxy } from './configureProxy'

export const actions = sdk.Actions.of().addAction(configureProxy)
