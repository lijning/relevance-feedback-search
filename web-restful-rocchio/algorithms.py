from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


def rocchio_relevance_feedback(query: str, ls_relev: list, ls_irrel: list, weights: tuple = None):
    """
    Using Rocchio algorithm to update query using relevance feedback.
    :param query: string of query
    :param ls_relev: list of relevant documents strings
    :param ls_irrel: list of irrelevant documents strings
    :param weights: (a,b,c) weights for query, relevant and irrelevant terms respectively.
    :return: dict of (word -> weight)
    """
    text_collection = ls_relev + ls_irrel + [query]
    len_relev, len_irrel = len(ls_relev), len(ls_irrel)

    if weights is None:
        weights = (1, 0.75, 0.15)
    a, b, c = weights

    vectorizer = TfidfVectorizer(stop_words='english', token_pattern=r'[a-zA-Z]{3,}')
    vectorizer.fit(text_collection)

    vec_query = vectorizer.transform([query]).todense()

    if len_relev == 0:
        term_relev = 0
    else:
        mat_relev = vectorizer.transform(ls_relev).todense()
        vec_relev = mat_relev.sum(axis=0)
        term_relev = vec_relev / len_relev

    if len_irrel == 0:
        term_irrel = 0
    else:
        mat_irrel = vectorizer.transform(ls_irrel).todense()
        vec_irrel = mat_irrel.sum(axis=0)
        term_irrel = vec_irrel / len_irrel

    vec_new = a * vec_query + b * term_relev - c * term_irrel

    tokens = vectorizer.get_feature_names()
    weights = np.asarray(vec_new).reshape(-1)

    return dict(zip(tokens, weights))


def generate_updated_query(query: str, dict_candidate_tokens: dict) -> str:
    """

    :param query:
    :param dict_candidate_tokens:
    :return:
    """
    tokens_sorted = sorted(dict_candidate_tokens.keys(),
                           key=dict_candidate_tokens.get,
                           reverse=True)
    max_cnt = 2
    new_tokens = []
    for token in tokens_sorted:
        if token not in query.lower():
            new_tokens.append(token)
        if len(new_tokens) >= max_cnt:
            break

    return query + " " + " ".join(new_tokens)
