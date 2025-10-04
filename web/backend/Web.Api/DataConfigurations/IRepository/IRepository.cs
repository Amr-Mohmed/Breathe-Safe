using System.Linq.Expressions;

namespace IRepository.Generic;

public interface IRepository<TEntity>
    where TEntity : class
{
    Task<TEntity> CreateAsync(TEntity entity); 
    Task<List<TEntity>> RetrieveAllAsync();
    Task<IEnumerable<TEntity>> RetrieveAllAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity?> RetrieveAsync(Expression<Func<TEntity, bool>> predicate);

  
}