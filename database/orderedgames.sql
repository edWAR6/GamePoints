#games
select game.* from game left join gamestock
on game.id = gamestock.gameid
left join user
on gamestock.userid = user.id
left join person
on user.personid = person.id
left join administrator
on person.id = administrator.personid
where ((person.active = 1 and person.complete = 1) || (person.id is null))
order by star DESC, case when gamestock.sku is null then 1 else 0 end, gamestock.sold, case when administrator.type is null then 1 else 0 end, administrator.type;



#articles
select * from article left join articlestock
on article.id = articlestock.articleid
order by case when articlestock.sku is null then 1 else 0 end, articlestock.sold;
