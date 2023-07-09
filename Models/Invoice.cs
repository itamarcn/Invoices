using Newtonsoft.Json;

namespace InvoicesManagement.Models;

public class Invoice
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("userId")]
    public string? UserId { get; set; }

    [JsonProperty("user")]
    public User? User { get; set; }

    [JsonProperty("date")]
    public string Date { get; set; }

    [JsonProperty("status")]
    public int Status { get; set; }

    [JsonProperty("item")]
    public string Item { get; set; }

    [JsonProperty("amount")]
    public int Amount { get; set; }
}


public class InvoicesResult
{
    public List<Invoice> Invoices { get; set; }
}
