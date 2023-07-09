using InvoicesManagement.Models;

namespace InvoicesManagement.Services
{
    public class InvoiceService
    {
        private readonly GraphQLService _graphQLService;

        public InvoiceService(GraphQLService graphQLService)
        {
            _graphQLService = graphQLService;
        }

        public async Task<List<Invoice>> GetInvoices()
        {
            var query = @"
                query GetInvoices {
                    Invoices {
                        id
                        userId
                        date
                        status
                        item
                        amount
                        user {
                          id
                          name
                          email
                          address
                          phone
                        }
                    }
                }
            ";

            var response = await _graphQLService.SendGraphQlRequest(query);
            return _graphQLService.ParseGraphQlResponse<List<Invoice>>(response, "Invoices");
        }

        public async Task<Invoice> GetInvoice(string id)
        {
            var query = @"
                query GetInvoice($id: uuid!) {
                    Invoices_by_pk(id: $id) {
                        id
                        userId
                        date
                        status
                        item
                        amount
                    }
                }";

            var variables = new { id };
            var response = await _graphQLService.SendGraphQlRequest(query, variables);
            return _graphQLService.ParseGraphQlResponse<Invoice>(response, "Invoices_by_pk");
        }

        public async Task<Invoice> CreateInvoice(Invoice invoice)
        {
            var mutation = @"
                mutation CreateInvoice($invoice: Invoices_insert_input!) {
                    insert_Invoices_one(object: $invoice) {
                        id
                        userId
                        date
                        status
                        item
                        amount
                    }
                }";

            var variables = new { invoice };
            var response = await _graphQLService.SendGraphQlRequest(mutation, variables);
            return _graphQLService.ParseGraphQlResponse<Invoice>(response, "Invoices_by_pk");
        }

        public async Task<Invoice> UpdateInvoice(string id, Invoice invoice)
        {
            var invoiceMutation = @"
                mutation UpdateInvoice($id: uuid!, $invoice: Invoices_set_input!) {
                    update_Invoices_by_pk(pk_columns: {id: $id}, _set: $invoice) {
                        id
                        userId
                        date
                        status
                        item
                        amount
                    }
                }";
            var invoiceVariables = new
            {
                id,
                invoice = new
                {
                    date = invoice.Date,
                    status = invoice.Status,
                    item = invoice.Item,
                    amount = invoice.Amount
                }
            };
            var invoiceResponse = await _graphQLService.SendGraphQlRequest(invoiceMutation, invoiceVariables);
            return _graphQLService.ParseGraphQlResponse<Invoice>(invoiceResponse, "update_Invoices_by_pk");
        }

        public async Task<bool> DeleteInvoice(string id)
        {
            var mutation = @"
                mutation DeleteInvoice($id: uuid!) {
                    delete_Invoices_by_pk(id: $id) {
                        id
                    }
                }";

            var variables = new { id };
            var response = await _graphQLService.SendGraphQlRequest(mutation, variables);
            return response.IsSuccessStatusCode;
        }
    }
}
