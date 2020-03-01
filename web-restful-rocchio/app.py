from flask import Flask, request
from flask_cors import CORS
from algorithms import rocchio_relevance_feedback, generate_updated_query
import json

app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def hello_world():
    return 'API url: /api/algorithm/rocchio/'


@app.route('/api/algorithm/rocchio/', methods=['GET', 'POST'])
def feedback_relevance():
    """
    Parse request body as json.
    :return:  new query
    """
    print("got!")
    response = {"status": None, "result": {}, "msg": ""}

    # raw = request.get_data()
    flag = request.is_json
    headers = request.headers
    data = request.get_json()

    if data is None or not request.is_json:
        response["status"] = 400
        response["msg"] = "Unable to decode json request."
        return response
    try:
        query = data.get('query')
        items = data.get('items')

        ls_relev, ls_irrel = [], []

        for item in items:
            content = item["text"]
            if item["relevant"] is True:
                ls_relev.append(content)
            else:
                ls_irrel.append(content)

        if type(query) != str:
            response["status"] = 400
            response["msg"] = "Value Errors."
            raise ValueError()

        candidates = rocchio_relevance_feedback(query, ls_relev, ls_irrel)
        new_query = generate_updated_query(query, candidates)
        response["status"] = 200
        response["result"] = new_query
    except ValueError:
        response["status"] = 400
        response["msg"] = "Invalid request json"
    except KeyError:
        response["status"] = 400
        response["msg"] = "Invalid request json"
    finally:
        print(response)
        return response


if __name__ == '__main__':
    app.run()
