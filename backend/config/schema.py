import strawberry
import typing
from rooms import schema as rooms_schema

# 더미 DB
"""
@strawberry.type
class Movie:
    pk: int
    title: str
    year: int
    rating: int

movies_db = [ Movie(pk=1, title="Godfather", year=1990, rating=10) ]
"""



#############################



@strawberry.type
class Query(rooms_schema.Query):
    pass


# 쿼리 리졸버
"""
def movies():
    return movies_db


def movie(movie_pk:int):
    return movies_db[movie_pk - 1]


@strawberry.type
class Query:
  movies:typing.List[Movie] = strawberry.field(resolver=movies)
  movie: Movie = strawberry.field(resolver=movie)
"""



# 일반 쿼리
"""
@strawberry.type
class Query:
    @strawberry.field
    def movies(self) -> typing.List[Movie]:
        return movies_db
    
    @strawberry.field
    def movie(self, movie_pk:int) -> Movie:
        return movies_db[movie_pk - 1]
"""
    


#############################

    
    
    
@strawberry.type
class Mutation(rooms_schema.Mutation):
    pass    

    
# 뮤테이션 리졸버
"""
def add_movie(title:str, year:int, rating:int):
    new_movie = Movie(pk=len(movies_db) + 1, title=title, year=year, rating=rating)
    movies_db.append(new_movie)
    return new_movie   
    
    
@strawberry.type
class Mutation:
    add_movie:Movie = strawberry.mutation(resolver=add_movie)
"""
    
    
# 일반 뮤테이션  
"""
@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_movie(self, title:str, year:int, rating:int) -> Movie:
        new_movie = Movie(pk=len(movies_db) + 1, title=title, year=year, rating=rating)
        movies_db.append(new_movie)
        return new_movie
"""
    



#############################
    
    
schema = strawberry.Schema(
    query=Query, 
    mutation=Mutation,
)

