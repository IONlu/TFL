{% extends "/docs.md" %}
{% block content %}
# Weather
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the weather data flowing through Transport for Luxembourg.
Currently we're providing data from [MeteoLux](https://data.public.lu/en/organizations/meteolux/) and [Administration de l'Environnement](http://www.environnement.public.lu/).

## License
The data from [MeteoLux](https://data.public.lu/en/organizations/meteolux/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).<br />
The data from [Administration de l'Environnement](http://www.environnement.public.lu/) is still unlicensed.

## Available endpoints
- [GET Weather](/RESTAPIs/Weather/index.md)
- [GET Weather/AirQuality](/RESTAPIs/Weather/AirQuality/index.md)
- [GET Weather/AirQuality/{ID}](/RESTAPIs/Weather/AirQuality/id.md)
{% endblock %}
