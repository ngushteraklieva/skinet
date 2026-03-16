using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
//This is an Entity Framework Core configuration class
//It is used to tell EF Core how the Order entity should be stored in the database.
//Use this class to configure how Order is mapped to the database
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(x => x.ShippingAddress, o => o.WithOwner());
        //ShippingAddress is not a separate table
        builder.OwnsOne(x => x.PaymentSummary, o => o.WithOwner());
        //PaymentSummary is not a separate table
        builder.Property(x => x.Status).HasConversion(
            o => o.ToString(),
            o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o)
        );
        //Save enum as string in DB
        //Convert back to enum in code
        builder.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");
        //Without this: EF may use wrong type → rounding errors
        builder.HasMany(x => x.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        //One Order → many OrderItems And: If Order is deleted → delete OrderItems
        builder.Property(x => x.OrderDate).HasConversion(
            x => x.ToUniversalTime(),
            x => DateTime.SpecifyKind(x, DateTimeKind.Utc)
        );
        //Store everything in UTC. No time mismatch
    }
}
