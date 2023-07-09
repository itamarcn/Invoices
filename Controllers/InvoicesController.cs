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
        private readonly UserService _userService;

        public InvoicesController(InvoiceService invoiceService, UserService userService)
        {
            _invoiceService = invoiceService;
            _userService = userService;
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
            var user = await _userService.GetUserById(invoice.UserId);
            var createdInvoice = await _invoiceService.CreateInvoice(invoice);
            createdInvoice.User = user;
            return CreatedAtAction(nameof(GetInvoice), new { id = createdInvoice.Id }, createdInvoice);
        }

        [HttpPut("{id}")]
        public async Task<Invoice> UpdateInvoice(string id, Invoice invoice)
        {
            var updatedInvoice = await _invoiceService.UpdateInvoice(id, invoice);
            return updatedInvoice;
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteInvoice(string id)
        {
            var isDeleted = await _invoiceService.DeleteInvoice(id);
            return isDeleted;
        }
    }
}
