using System;
using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

//BaseSpecification → stores the rule
public class BaseSpecifications<T>(Expression<Func<T, bool>> criteria) : ISpecification<T>
{
    //Expression<Func<T,bool>> → a condition in code that EF can convert to SQL
    public Expression<Func<T, bool>> Criteria => criteria;
}
