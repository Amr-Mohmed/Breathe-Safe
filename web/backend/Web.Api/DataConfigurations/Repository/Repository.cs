using System.Linq.Expressions;
using DataConfiguration;
using IRepository.Generic;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Generic;

public class BaseRepository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    
    protected readonly ApplicationDbContext _db;

    public BaseRepository(ApplicationDbContext context)
    {
        _db = context;
    }

    /// <summary>
    /// Create an entity in the database.
    /// </summary>
    /// <param name="entity">the entity type to be creat.</param>
    /// <returns>the entity after created it.</returns>
    public async Task<TEntity> CreateAsync(TEntity entity)
    {
        await _db.Set<TEntity>().AddAsync(entity);
        return entity;
    }

 

    public async Task<TEntity?> RetrieveAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _db.Set<TEntity>().AsNoTracking().FirstOrDefaultAsync(predicate);
    }

 

    public Task<List<TEntity>> RetrieveAllAsync()
    {
        return _db.Set<TEntity>().AsNoTracking().Select(entity => entity).ToListAsync();
    }

    public async Task<IEnumerable<TEntity>> RetrieveAllAsync(
        Expression<Func<TEntity, bool>> predicate
    ) // change the return type
    {
        return await _db.Set<TEntity>().AsNoTracking().Where(predicate).ToListAsync();
    } 

 
}