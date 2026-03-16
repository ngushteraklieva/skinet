using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
    Task<bool> Complete();
}

//Returns a repository for any entity
//where TEntity : BaseEntity → only works with entities that inherit from BaseEntity
//Generic = works for Order, OrderItem, Product, etc.
//Complete()->Saves all changes tracked by repositories in one transaction