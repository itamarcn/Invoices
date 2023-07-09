using InvoicesManagement.Models;
using InvoicesManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace InvoicesManagement.Controllers
{
    [ApiController]
    [Route("invoices")]
    public class InvoicesController : ControllerBase
    {
        private readonly InvoiceService _invoiceService;

        public InvoicesController(InvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var invoices = await _invoiceService.GetInvoices();
            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoice(string id)
        {
            var invoice = await _invoiceService.GetInvoice(id);
            if (invoice == null)
            {
                return NotFound();
            }

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice(Invoice invoice)
        {
            var createdInvoice = await _invoiceService.CreateInvoice(invoice);
            return CreatedAtAction(nameof(GetInvoice), new { id = createdInvoice.Id }, createdInvoice);
        }

        [HttpPut("{id}")]
        public async Task<Invoice> UpdateInvoice(string id, Invoice invoice)
        {
            var updatedInvoice = await _invoiceService.UpdateInvoice(id, invoice);
            return updatedInvoice;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(string id)
        {
            var isDeleted = await _invoiceService.DeleteInvoice(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
