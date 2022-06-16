import { prisma } from '@prisma/client'
import { gql } from 'apollo-server'
import { Context } from './context'
import {
  deviceTrafficToCountries,
  device,
  devices,
  flows,
  serverConfig,
  adsAndTrackerBytes,
  unencryptedHttpTrafficBytes,
  weakEncryptionBytes,
  dataUploadedToCounterParty,
  communicationEndpointNames
} from './resolvers'

export const typeDefs = gql`
  type ServerConfig {
    start_timestamp: Int
  }

  type DeviceByCountry {
    device_id: String
    counterparty_friendly_name: String
    counterparty_hostname: String
    country_code: String!
    outbound_byte_count: Int!
    last_updated_time_per_country: Float!
    device: Device
  }

  type CommunicationEndpointName {
    counterparty_hostname: String
  }

  type Device {
    id: ID
    device_id: String!
    ip: String!
    mac: String!
    dhcp_hostname_list: String!
    netdisco_list: String!
    user_agent_list: String!
    syn_scan_port_list: String!
    auto_name: String!
    last_updated_ts: Float!
    outbound_byte_count: Int # Included from the Flow Type
    flows: [Flow]
  }

  type Flow {
    id: ID
    device: Device
    device_id: ID!
    device_port: Int!
    counterparty_ip: String!
    counterparty_port: Int!
    counterparty_hostname: String!
    counterparty_friendly_name: String!
    counterparty_country: String!
    counterparty_is_ad_tracking: Int!
    counterparty_local_device_id: ID!
    transport_layer_protocol: String!
    uses_weak_encryption: Int!
    ts: Float!
    ts_mod_60: Float!
    ts_mod_600: Float!  # every 10 minutes
    ts_mod_3600: Float! # Every 1 hour
    window_size: Float!
    inbound_byte_count: Int!
    outbound_byte_count: Int!
    inbound_packet_count: Int!
    outbound_packet_count: Int!
    _sum: Int
  }

  type Query {
    device(device_id: String): Device
    devices: [Device!]!
    flows(current_time: Int, device_id: String): [Flow!]!
    serverConfig: ServerConfig
    deviceTrafficToCountries(device_id: String!): [DeviceByCountry!]!
    adsAndTrackerBytes(current_time: Int): Flow
    unencryptedHttpTrafficBytes(current_time: Int): Flow
    weakEncryptionBytes(current_time: Int): Flow
    dataUploadedToCounterParty(current_time: Int): [DeviceByCountry]
    communicationEndpointNames(device_id: String): [CommunicationEndpointName]!
  }
`

export const resolvers = {
  Query: {
    device,
    devices,
    flows,
    serverConfig,
    deviceTrafficToCountries,
    adsAndTrackerBytes,
    unencryptedHttpTrafficBytes,
    weakEncryptionBytes,
    dataUploadedToCounterParty,
    communicationEndpointNames
  },
}
