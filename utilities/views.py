# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
import json

from django.views.decorators.csrf import csrf_exempt

from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render_to_response
import os
module_dir = os.path.dirname(__file__)  # get current directory
file_path = os.path.join(module_dir, 'data.json')


@csrf_exempt
def index(request):
    if request.is_ajax():
        if request.method == 'POST':
            new_entry(request.body)
    #template = loader.get_template('index_old.html')
    json_data = json.load(open(file_path))

    #return HttpResponse(json_data)
    return render(request, 'index.html', {"data": json.dumps(json_data)})


def new_entry(data):

    # read the file into a list of lines
    lines = open(file_path, 'r').readlines()

    # now edit the last line of the list of lines
    new_last_line = (", \n" +data +"\n ]")
    lines[-1] = new_last_line

    # now write the modified list back out to the file
    open(file_path, 'w').writelines(lines)