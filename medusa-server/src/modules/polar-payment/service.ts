import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { Polar } from "@polar-sh/sdk"
import type {
  CreatePaymentProviderSession,
  UpdatePaymentProviderSession,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"

type PolarOptions = {
  accessToken: string
  webhookSecret: string
  sandbox?: boolean
}

type PolarSessionData = {
  checkoutId?: string
  checkoutUrl?: string
  status: "pending" | "authorized" | "captured" | "canceled" | "failed"
}

class PolarPaymentProviderService extends AbstractPaymentProvider<PolarOptions> {
  static identifier = "polar"
  protected client: Polar
  protected options_: PolarOptions

  constructor(container: Record<string, unknown>, options: PolarOptions) {
    super(container, options)
    this.options_ = options
    this.client = new Polar({
      accessToken: options.accessToken,
      server: options.sandbox ? "sandbox" : "production",
    })
  }

  /**
   * Initialize a payment session with Polar
   */
  async initiatePayment(
    input: CreatePaymentProviderSession
  ): Promise<{ data: PolarSessionData }> {
    const { amount, currency_code, context } = input

    try {
      // Create a Polar checkout session
      const checkout = await this.client.checkouts.custom.create({
        productPriceId: context?.polar_product_price_id as string,
        successUrl: context?.success_url as string || `${context?.base_url}/order/confirmation`,
        metadata: {
          medusa_cart_id: context?.cart_id as string,
          medusa_customer_id: context?.customer_id as string,
        },
        customerEmail: context?.customer_email as string,
      })

      return {
        data: {
          checkoutId: checkout.id,
          checkoutUrl: checkout.url,
          status: "pending",
        },
      }
    } catch (error) {
      console.error("Polar payment initiation failed:", error)
      return {
        data: {
          status: "failed",
        },
      }
    }
  }

  /**
   * Update an existing payment session
   */
  async updatePayment(
    input: UpdatePaymentProviderSession
  ): Promise<{ data: PolarSessionData }> {
    // Polar doesn't support updating existing checkouts
    // Return existing data
    return {
      data: input.data as PolarSessionData,
    }
  }

  /**
   * Delete a payment session
   */
  async deletePayment(
    paymentSessionData: PolarSessionData
  ): Promise<{ data: PolarSessionData }> {
    return {
      data: {
        ...paymentSessionData,
        status: "canceled",
      },
    }
  }

  /**
   * Authorize the payment
   */
  async authorizePayment(
    paymentSessionData: PolarSessionData
  ): Promise<{ status: string; data: PolarSessionData }> {
    return {
      status: "authorized",
      data: {
        ...paymentSessionData,
        status: "authorized",
      },
    }
  }

  /**
   * Capture the authorized payment
   */
  async capturePayment(
    paymentSessionData: PolarSessionData
  ): Promise<{ data: PolarSessionData }> {
    return {
      data: {
        ...paymentSessionData,
        status: "captured",
      },
    }
  }

  /**
   * Refund a captured payment
   */
  async refundPayment(
    paymentSessionData: PolarSessionData,
    refundAmount: number
  ): Promise<{ data: PolarSessionData }> {
    // Implement Polar refund logic here
    console.log(`Refunding ${refundAmount} for checkout ${paymentSessionData.checkoutId}`)
    return {
      data: paymentSessionData,
    }
  }

  /**
   * Cancel an authorized payment
   */
  async cancelPayment(
    paymentSessionData: PolarSessionData
  ): Promise<{ data: PolarSessionData }> {
    return {
      data: {
        ...paymentSessionData,
        status: "canceled",
      },
    }
  }

  /**
   * Get the status of a payment
   */
  async getPaymentStatus(
    paymentSessionData: PolarSessionData
  ): Promise<string> {
    return paymentSessionData.status
  }

  /**
   * Retrieve the payment data
   */
  async retrievePayment(
    paymentSessionData: PolarSessionData
  ): Promise<{ data: PolarSessionData }> {
    return {
      data: paymentSessionData,
    }
  }

  /**
   * Handle incoming webhooks from Polar
   */
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const event = payload.data as Record<string, unknown>
    const eventType = event.type as string

    switch (eventType) {
      case "checkout.created":
        return {
          action: "not_supported",
        }

      case "checkout.updated":
        const status = (event.data as Record<string, unknown>)?.status
        if (status === "succeeded") {
          return {
            action: "authorized",
            data: {
              session_id: (event.data as Record<string, unknown>)?.id as string,
              amount: (event.data as Record<string, unknown>)?.amount as number,
            },
          }
        }
        return {
          action: "not_supported",
        }

      case "order.created":
        return {
          action: "captured",
          data: {
            session_id: (event.data as Record<string, unknown>)?.checkout_id as string,
          },
        }

      default:
        return {
          action: "not_supported",
        }
    }
  }
}

export default PolarPaymentProviderService
