import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { Polar } from "@polar-sh/sdk"
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
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
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
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
        id: checkout.id,
        data: {
          checkoutId: checkout.id,
          checkoutUrl: checkout.url,
          status: "pending",
        } as PolarSessionData,
      }
    } catch (error) {
      console.error("Polar payment initiation failed:", error)
      return {
        id: `polar_${Date.now()}`,
        data: {
          status: "failed",
        } as PolarSessionData,
      }
    }
  }

  /**
   * Update an existing payment session
   */
  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
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
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      data: {
        ...sessionData,
        status: "canceled",
      } as PolarSessionData,
    }
  }

  /**
   * Authorize the payment
   */
  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      status: "authorized",
      data: {
        ...sessionData,
        status: "authorized",
      } as PolarSessionData,
    }
  }

  /**
   * Capture the authorized payment
   */
  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      data: {
        ...sessionData,
        status: "captured",
      } as PolarSessionData,
    }
  }

  /**
   * Refund a captured payment
   */
  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const sessionData = input.data as PolarSessionData
    // Implement Polar refund logic here
    console.log(`Refunding ${input.amount} for checkout ${sessionData.checkoutId}`)
    return {
      data: sessionData,
    }
  }

  /**
   * Cancel an authorized payment
   */
  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      data: {
        ...sessionData,
        status: "canceled",
      } as PolarSessionData,
    }
  }

  /**
   * Get the status of a payment
   */
  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      status: sessionData.status,
    }
  }

  /**
   * Retrieve the payment data
   */
  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const sessionData = input.data as PolarSessionData
    return {
      data: sessionData,
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
        const eventData = event.data as Record<string, unknown>
        const status = eventData?.status
        if (status === "succeeded") {
          return {
            action: "authorized",
            data: {
              session_id: eventData?.id as string,
              amount: eventData?.amount as number,
            },
          }
        }
        return {
          action: "not_supported",
        }

      case "order.created":
        const orderData = event.data as Record<string, unknown>
        return {
          action: "captured",
          data: {
            session_id: orderData?.checkout_id as string,
            amount: orderData?.amount as number,
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
