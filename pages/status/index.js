import useSWR from "swr";

function getNestedProperty(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <PropStatus propKey="updated_at" name="Ultima atualização" />
      <PropStatus
        propKey="dependencies.database.max_connections"
        name="Número Maximo de conexões"
      />
      <PropStatus
        propKey="dependencies.database.opened_connections"
        name="Conxões abertas"
      />
      <PropStatus propKey="dependencies.database.version" name="Versão" />
    </>
  );
}

function PropStatus({ propKey, name }) {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let valueText = "Carregando ...";

  if (!isLoading) {
    const valueProp = getNestedProperty(data, propKey);

    if (valueProp) {
      if (propKey === "updated_at") {
        valueText = new Date(valueProp).toLocaleString("pt-br");
      } else {
        valueText = valueProp;
      }
    } else {
      valueText = "Propriedade não encontrada";
    }
  }

  return (
    <div>
      {name}: {valueText}
    </div>
  );
}
