export const hypercert = `
    data {
        creation_block_timestamp
        units
        creator_address
        contract {
          chain_id
        }
        metadata {
          name
          description
          contributors
          work_scope
        }
        attestations {
          data {
            data
          }
        }
        orders {
          totalUnitsForSale
          cheapestOrder {
            pricePerPercentInUSD
          }
          data {
            orderNonce
            id
          }
        }
        sales {
          data {
            buyer
            currency
            currency_amount
          }
        }
        hypercert_id
    }
`;
