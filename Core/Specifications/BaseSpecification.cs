using System;
using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

//BaseSpecification → stores the rule
public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{
    protected BaseSpecification():this(null){}
    //Expression<Func<T,bool>> → a condition in code that EF can convert to SQL
    public Expression<Func<T, bool>>? Criteria => criteria;

    public Expression<Func<T, object>>? OrderBy {get; private set;}

    public Expression<Func<T, object>>? OrderByDescending {get; private set;}

    protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

     protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }

}
