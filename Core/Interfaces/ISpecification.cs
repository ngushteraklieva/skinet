using System;
using System.Linq.Expressions;

namespace Core.Interfaces;

//ISpecification → a “rule” or “question”
public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria {get;}
    Expression<Func<T, object>>? OrderBy {get;}
    Expression<Func<T, object>>? OrderByDescending {get;}

}
